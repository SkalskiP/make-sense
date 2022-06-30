from PIL import Image
import os, sys

dir_path = "./public/guides/icons"

def resize_im(path, size=(96,96)):
    if os.path.isfile(path):
        im = Image.open(path).resize(size, Image.ANTIALIAS)
        im.save(path)
        # parent_dir = os.path.dirname(path)
        # img_name = os.path.basename(path).split('.')[0]
        # im.save(os.path.join(parent_dir, img_name + 'r.jpg'), 'JPEG', quality=90)

def resize_all(mydir):
    for subdir , _ , fileList in os.walk(mydir):
        for f in fileList:
            try:
                full_path = os.path.join(subdir,f)
                if(full_path.endswith("_s.png")):
                    resize_im(full_path)
                elif(full_path.endswith(".png")):
                    resize_im(full_path, size=(300, 300))
                else:
                    print("Not a png file: " + full_path)
            except Exception as e:
                print('Unable to resize %s. Skipping.' % full_path)

if __name__ == '__main__':
    resize_all(dir_path)